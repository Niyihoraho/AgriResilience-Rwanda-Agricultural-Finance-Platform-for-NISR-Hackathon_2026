import re
import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
df = pd.read_csv(BASE_DIR / 'data' / 'processed' / 'district_effective_rainfall.csv')
eff_map = df.groupby('district')['seasonal_effective_rainfall_mm'].mean().round(1).to_dict()

path = BASE_DIR / 'frontend' / 'src' / 'data' / 'rwandaDistrictsData.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

updated = 0
for dname, eff in eff_map.items():
    pattern = rf'("name":\s*"{dname}"[\s\S]*?"rainfall":\s*[\d\.]+)'
    match = re.search(pattern, content)
    if match and '"effectiveRainfall"' not in match.group(0):
        replacement = match.group(0) + f',\n    "effectiveRainfall": {eff}'
        content = content.replace(match.group(0), replacement, 1)
        updated += 1

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Updated {updated} districts in {path.name}")

