import pandas as pd

# a = pd.read_csv("shortened_text_only.csv")
# b = pd.read_csv("scraped_text.csv")
# # b = b.dropna(axis=1)
# merged = a.merge(b, on='Ad_ID')
# merged.dropna(thresh=3)
# merged.to_csv("output.csv", index=False)

df = pd.read_csv("output3.csv")
# filter_csv = df["Headline"] != "" and df["AD_Link"] != "" and df["Content"] != ""

df.dropna(subset=['Headline', 'AD_Link', 'Content'], inplace=True)

df.to_csv("output4.csv", index=False)