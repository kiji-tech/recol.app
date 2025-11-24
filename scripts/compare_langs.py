import json
import os

files = {
    'en': 'src/languages/en.json',
    'ja': 'src/languages/ja.json',
    'fr': 'src/languages/fr.json',
    'de': 'src/languages/de.json'
}

keys_sets = {}
all_keys = set()

def get_paths(d, current_path=""):
    paths = set()
    for k, v in d.items():
        new_path = f"{current_path}.{k}" if current_path else k
        if isinstance(v, dict):
            paths.update(get_paths(v, new_path))
        else:
            paths.add(new_path)
    return paths

for lang, path in files.items():
    if not os.path.exists(path):
        print(f"File not found: {path}")
        keys_sets[lang] = set()
        continue
        
    try:
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            keys = get_paths(data)
            keys_sets[lang] = keys
            all_keys.update(keys)
    except Exception as e:
        print(f"Error reading {path}: {e}")
        keys_sets[lang] = set()

sorted_keys = sorted(list(all_keys))

print("| Key | en | ja | fr | de |")
print("|---|---|---|---|---|")

diff_found = False
for key in sorted_keys:
    presence = {lang: (key in keys_sets[lang]) for lang in files.keys()}
    if not all(presence.values()):
        diff_found = True
        row = f"| {key} |"
        for lang in ['en', 'ja', 'fr', 'de']:
            row += f" {'✅' if presence[lang] else '❌'} |"
        print(row)

if not diff_found:
    print("No differences found.")
