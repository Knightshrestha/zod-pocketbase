# zod-pocketbase

## 0.5.0

### Minor Changes

- remove "cache" option for "helpersFrom" and replace it with "fetch" to allow a more generic custom fetch and remove "@11ty/eleventy-fetch" dependency

## 0.4.1

### Patch Changes

- update packages
- fix json import

## 0.4.0

### Minor Changes

- separate files that use node packages in server directory

## 0.3.8

### Patch Changes

- fix cached version

## 0.3.7

### Patch Changes

- d5481dc: fix getRecords return type

## 0.3.6

### Patch Changes

- a8d3098: add recordsListFrom method to construct a records list schema from a record schema
- a8d3098: fix getRecords helper return type

## 0.3.5

### Patch Changes

- optimize SKD calls and options

## 0.3.4

### Patch Changes

- rename out to output

## 0.3.3

### Patch Changes

- refactor code

## 0.3.2

### Patch Changes

- fix syntax

## 0.3.1

### Patch Changes

- fix generated syntax

## 0.3.0

### Minor Changes

- refactor CLI

## 0.2.4

### Patch Changes

- 03555e2: fix optional expand in expand method

## 0.2.3

### Patch Changes

- cdf2b59: fix the transformation when expand is undefined

## 0.2.2

### Patch Changes

- 6980455: fix the case when expand only contains keys with optional schemas

## 0.2.1

### Patch Changes

- be3d479: add cache option to helpers

## 0.2.0

### Minor Changes

- 5435793: rename getHelpers to helpersFrom
- 5435793: add collectionName literal to schema
