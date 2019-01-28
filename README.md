# comparison

Comparing data fetching with resolver dataloaders vs joins.

## Installing

Clone the app and run yarn to install the dependencies:

```
git clone https://github.com/dbrudnicki/comparison.git

cd comparison

yarn
```

After running yarn, start the MySQL Docker Service:

```
docker-compose up -d mysql
```

Check the logs to see when the port is assigned to 3306. Once the MySql instance is running execute the following:

```
yarn load-data
```

After the data has been loaded you can start the app:

```
yarn start
```

## Queries

Here are the two queries I used:

```
query JoinedJobs {
  joinedJobs {
    id
    name
    buildPart
    Tasks {
     	id
      name
    }
  }
}
```

and

```
query DataLoaderJobs {
  dataLoaderJobs {
    id
    name
    buildPart
    tasks {
     	id
      name
    }
  }
}
```
