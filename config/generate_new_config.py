import sys
import json
import glob
import os.path

# generate a new config
# $ python3 generate_new_config.py rubyNewChain ../../backend/ > regen.json
# compare config
# $ jd regen.json rubyNewSchain.json

CHAIN = sys.argv[1]
BACKEND_DIR = sys.argv[2]

deployment_dir = os.path.join(BACKEND_DIR, 'deployments', CHAIN)
pool_deployment_file = os.path.join(BACKEND_DIR, 'deployment_addresses', 'new_pools_addr.%s.json' % CHAIN)


addrs = {}

for fn in glob.glob(os.path.join(deployment_dir, '*.json')):
    if fn.endswith('_Proxy.json') or fn.endswith('_Implementation.json'):
        continue

    name = os.path.splitext(os.path.basename(fn))[0]
    with open(fn) as f:
        assert name not in addrs
        dat = json.load(f)
        addrs[name] = {'address': dat['address'],
                       'addressLower': dat['address'].lower()}
        try:
            addrs[name]['blockNumber'] = dat['receipt']['blockNumber']
        except KeyError:
            pass

with open(pool_deployment_file) as f:
    for k, v in json.load(f).items():
        addrs['pool+%s' % k] = {'address': v,
                                'addressLower': v.lower()}

def get_new_val(_template_var):
    if '|' in _template_var:
        n,p = _template_var.split('|')
        return addrs[n][p]
    else:
        return _template_var

with open('__template.json') as f:
    tmpl = json.load(f)

new = {}
for k, v in tmpl.items():
    if isinstance(v, str):
        new[k] = get_new_val(v)
    elif isinstance(v, list):
        newl = []
        for lv in v:
            newl.append(get_new_val(lv))
        new[k] = newl
    elif isinstance(v, dict):
        newd = {}
        for dk, dv in v.items():
            newd[dk] = get_new_val(dv)
        new[k] = newd

print(json.dumps(new, indent=4))

#for name in sorted(addrs.keys()):
#    print name, addrs[name]

#with open('contracts.json', 'wt') as f:
#    json.dump(addrs, f)

