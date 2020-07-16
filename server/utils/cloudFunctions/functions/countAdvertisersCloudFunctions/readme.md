`aggregates` refers to a collection of aggregated ad data broken down by year. 
A motivated example might be: 
- `dev_aggregates` collection
  - `2018` doc
    - `advertiser` collection
      - `advertiser_A` doc
        - `numberOfAds: 1`
      - `advertiser_B` doc
        - `numberOfAds: 2`
  - `2019` doc
    - `advertiser` collection
      - `advertiser_C` doc
        - `numberOfAds: 2`
      - `advertiser_D` doc
        - `numberOfAds: 0 // Had an ad, but was deleted from 'dev_ads'. Doc still persists.`
  - `2020` doc
    - `advertiser` collection
      - `advertiser_A` doc
        - `numberOfAds: 3`

In this case, there would be 8 ads in `dev_ads` in total, 
by advertisers `A`, `B`, `C`. At one point, `advertiser_D` had at least one ad
during `2019`, but they were all deleted. 

Motivation for doing this: 
- Enable a simple query for `10 most common advertisers in 20XX`.  
- This would be a complicated query to do client side. 
- This would be a read expensive query to do repeatedly - 
  can't rely on firestore cache easily. See [here.](https://stackoverflow.com/questions/38423277/does-firebase-cache-the-data)
- This would be a slow query to do client side/just in time (would have to 
  tabulate across all advertisers, then only keep a small portion)

Sample query: 
```javascript
// Returns the 15 biggest advertisers in 2018, and how many ads each bought.
db.collection("dev_aggregates")
  .doc("2018")
  .collection("advertisers")
  .orderBy("numberOfAds", "desc")
  .limit(15)
```
Some implementation details: 
- An advertiser is considerered to have
  an ad in a particular year if the `startDate` began in said year (i.e., an ad
  with `startDate: 2019-12-31` would fall in `2019`.)
  - Ads are imported as iso date strings into firestore by `adWriter.java`.
    Simple string parsing is used to recover the year. 
- Ads are not *strictly* limited to 2018, 2019, 2020. The current dataset
  only has these years, hence, examples and tests use them. 
  If an ad with a `startDate` outside this range were added,
  it would be properly counted, and its year would be properly recorded.   
- ~~Ads are not currently checked for well-formedness or well-typed. 
  This decision was made because, as cloud functions, `countAdvertisersOnCreate` 
  and `countAdvertisersOnDelete` are only triggered by write events to the `ads`
  or `dev_ads` database. Writes to `ads` should only occur from `adWriter.java`,
  which should only push well-formed, well-typed data. Writes to `dev_ads` 
  have a similar level of expectation - don't test with garbage data. If 
  garbage data does come in, some type of error will show up in the firebase
  log.~~ It was easy to implement so I implemented it. 


  