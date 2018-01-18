---
title: "Introduction to R"
date: 2018-01-18T08:09:14+11:00
description: Exploring EC2 pricing data using R
draft: true
categories:
    - data analysis
tags:
    - devops
    - development
    - R
    - data analysis
author: Henrik Axelsson
excerpt:
    Sometimes using Excel to look at data works really well. Other times, such as when you are trying to make sense of a 170MB file of AWS EC2 pricing data it just sucks.

    Luckily R exists and can do the job really well!

    In this post I'll run through some of the features of R and produce a nicely formatted CSV of on demand EC2 pricing data.
---

R is great for doing any kind of slicing and dicing with data. However the barrier to entry can be high, especially for people that come from a non-data background. I know that it took me quite some time to grasp just how R does it's magic. When you do though, it really is a "that's damn awesome" moment.

Rather than running through all of the basics of R, I put together a script that takes you through some of the features of R in the context of analysing EC2 pricing data.

The script in the code block below can run from beginning to end by an R interpreter. However I would suggest to get the most from it run each command one at a time, look at the output and perhapd have a look at the documentation for the commands run. RStudio provides a really nice (and free) development environment to use. You can get it from here: https://www.rstudio.com

So after you've installed RStudio, dive into the script below!

```
## R pricing fun

## This script will go through the code I wrote for extracting on demand pricing for AWS
## and explore some of the ways R makes playing with data easy.
##
## We will basically be:
## 1. Downloading the AWS EC2 pricing file.
## 2. Selecting the data we want to save.
## 3. Saving the data to a csv.

## Lets get some data to look at.

## First need to set our working directory, can do this from the RStudio menus
## Go to Session -> Set Working Directory
## Or by running setwd("path")


## Assign a variable for the data file name.
## This is where we will save the data from amazon and then read back in.
pricing_file_name <- './raw_pricing_data.csv'

## Download the file!
## Note the file is around 170MB, so you might want to only do this once.
download.file('https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/current/index.csv',
              pricing_file_name)

## Read in some of the data.
## Because the file is quite large, we will only read the first 100 rows
## the first 5 rows must be skipped due to the formatting of the file
pricing_header <- read.csv(file = pricing_file_name,
                           skip = 5,
                           nrows = 100,
                           stringsAsFactors = TRUE)

## Now lets have a look at the data:
str(pricing_header)

## what kind of data does instance type column have?
pricing_header$Instance.Type

## R tells us there are 59 levels in the factor (factor is like an enum), but we can't see them all
## here's how we can see them
levels(pricing_header$Instance.Type)

## So what is the type of the data in Instance.Type
typeof(pricing_header$Instance.Type)

## doesn't look like an integer... what if we cast it to an integer
as.integer(pricing_header$Instance.Type)

## So how does R get these integer values?
## Lets look at the first element:
pricing_header$Instance.Type[1]

## What if we convert the first element to an integer?
as.integer(pricing_header$Instance.Type[1])

## Look back at the levels vector, and get out the element at the index
## given above
levels(pricing_header$Instance.Type)[as.integer(pricing_header$Instance.Type[1])]

## So the levels are stored as a vector of strings, and the vector of values are stored as
## indices into that vector.

## How many instances of m4.xlarge exist in our current data frame:
pricing_header$Instance.Type == "m4.xlarge"

## This command has gone and compared the value against each element in the vector.
## Why is this useful? Boolean values can be used to select elements from a vector.

## For example what happens if we try:
pricing_header$Instance.Type[FALSE]

## Then:
pricing_header$Instance.Type[TRUE]

## Perhaps something in between:
pricing_header$Instance.Type[c(TRUE,FALSE)]
## This statement has repeated the true false sequence across the whole vector and only selected
## every second element.

## Going back to the example before, we can select the elements of the vector
## that are equal to a certain value:
pricing_header$Instance.Type[pricing_header$Instance.Type == "m4.xlarge"]

## We can get the whole two rows of data out of the data frame by changing
## the statement slightly.
## This is now working on the data frame where as the previous statement was
## executing on one list from the data frame:
pricing_header[pricing_header$Instance.Type == "m4.xlarge",]

## Limit the results to just the instance type again like this:
pricing_header[pricing_header$Instance.Type == "m4.xlarge", "Instance.Type"]

## What if we also want the price?
pricing_header[pricing_header$Instance.Type == "m4.xlarge", c("Instance.Type", "PricePerUnit")]

## Lets see the prices for all the instance types:
pricing_header[, c("Instance.Type", "PricePerUnit")]

## Hard to read, how about sorting the results in price order?
## The order function to the rescue:
order(pricing_header$PricePerUnit)

## That gives us a vector of vector indices!
## How are indices useful?
pricing_header$PricePerUnit[c(50, 57, 77)]
pricing_header$PricePerUnit[tail(order(pricing_header$PricePerUnit),3)]

pricing_header$PricePerUnit[order(pricing_header$PricePerUnit)]

## Now to order the rows in the data frame, we pass in the ordered indices that were
## produced by the order function:
pricing_header[order(pricing_header$PricePerUnit), c("Instance.Type", "PricePerUnit")]

## That doesn't save the ordering...
## How about over writing the existing data with the ordered data:
pricing_header <- pricing_header[order(pricing_header$PricePerUnit),]

## We have now assigned over pricing_header, an ordered version of the same data:
pricing_header[,c("Instance.Type","PricePerUnit")]

## Enough playing around! Lets start doing something useful with this data.
## We had quite a few columns:
length(pricing_header)

## Hang on, why does length(pricing_header) return the number of columns in the data frame?
## A data frame is simply a list of lists:
length(pricing_header[1])

## Didn't we read in 100 rows? So where are they all?
## Some investigation on what pricing_header[1] returns..
pricing_header[1]
typeof(pricing_header[1])

## It actually returns a list named "SKU" lists are slightly different to vectors.
## Lists have named elements, and every element can be a different type.

## What about this:
pricing_header[[1]]
typeof(pricing_header[[1]])
## Using double square brackets will extract the vector out of the first list element.

## When dealing with large data sets, it's much faster to only load the columns you are
## interested in. This is why we loaded the first 100 rows to have a poke a round with
## first before loading the whole file.

## There are 66 columns in the table, we don't want them all!
## Remember what the column names were?
names(pricing_header)

## Investigation on this data showed me that the primary key fields were:
id_cols <- c('TermType',
             'Location',
             'Instance.Type',
             'License.Model',
             'Operating.System',
             'Pre.Installed.S.W',
             'Tenancy')

## The pricing columns were:
price_cols <- c('Unit',
                'PricePerUnit')

## Of course we want to combine the two:
data_cols <- c(id_cols, price_cols)

## Lets have a quick peek at what this data looks like:
head(pricing_header[,data_cols])

## When reading the file, we can specify a 'colclasses' attribute.
## Any columns that are set to 'NULL' will not be read from the source file.
## If a column is set to 'NA' R will determine the most appropriate data type to cast it to.

## We want to set 'NA' for all the columns we want to read in.
## Do to this, we need to know the column indices!
## A function called match can help us here.
## As a test try:
match('b', c('a','b'))

## Match can use this on the vector of column names we want to keep and the vector of
## all column names from the table:
col_indexes <- match(data_cols, names(pricing_header))

## Now we know the indices we want to keep.
## First create a vector of 'NA':
classes <- rep(c(NA), times = length(names(pricing_header)))

## Any element that doesn't match at index in col_indexes should be null.
## Columns set to null will not be read from the file:
classes[-col_indexes] <- 'NULL'

## Read the whole file in using the colclasses:
price_data <- read.csv(file = pricing_file_name,
                       skip = 5,
                       colClasses = classes,
                       stringsAsFactors = TRUE)

## Take a look at what we just read in
str(price_data)

## Combining a few techniques covered above will allow us to filter and sort the
## pricing data in a more useful form, including only the information of interest.
filtered_data <- price_data[price_data$TermType == 'OnDemand' &
                              price_data$Location == 'Asia Pacific (Sydney)' &
                              price_data$Operating.System %in% c('Windows','Linux') &
                              is.na(price_data$Pre.Installed.S.W) == TRUE &
                              price_data$License.Model %in% c('License Included','No License required') &
                              price_data$Tenancy == 'Shared', ]

## Checking the row count shows the dataset is now much smaller:
str(filtered_data)

## Looking at the data will show there's no order to it:
filtered_data

## Order it so it looks nice:
filtered_data <- filtered_data[order(filtered_data$Instance.Type, filtered_data$Operating.System),]

## Have another look, much easier to read:
filtered_data

## Some of this information isn't useful for our output file, but was necessary to filter on
## so let chop down some of the columns
output_data <- filtered_data[,c('Instance.Type', 'TermType', 'Operating.System', 'PricePerUnit')]

## We might also want to change the  names that are written out
names(output_data) <- c('instance_type', 'term_type', 'os', 'price')

## R assigns row names too, which by default are the row numbers.
## Don't want these written in the output file:
row.names(output_data) <- NULL

## Finally write the data to a CSV:
write.table(output_data,
            file = 'ondemand_output.csv',
            row.names = FALSE,
            quote = FALSE,
            sep = ',')
```

So that's it! I hope you found this interesting and perhaps even a little fun.
