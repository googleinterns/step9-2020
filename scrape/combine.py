import pandas as pd

a = pd.read_csv("shortened_text_only.csv")
b = pd.read_csv("scraped_text.csv")
# b = b.dropna(axis=1)
merged = a.merge(b, on='Ad_ID')
merged.dropna(thresh=3)
merged.to_csv("output.csv", index=False)
