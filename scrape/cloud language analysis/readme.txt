To run sentiment analysis on your local machine you will to follow these instructions:
https://cloud.google.com/natural-language/docs/setup

in particular, you will need an api key. Don't push your api key to github please. 

The test file with STRING_ONE and STRING_TWO runs for me in about 1 second, so expect about 1/4 of a second per api call. Query rate limit is 600/minute so that's pretty good.  