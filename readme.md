```sh
npm install
```

```sh
npm run dev
```


### back-front api
1) correct query
```sh
curl -X POST http://localhost:3000/api/data \
-H "Content-Type: application/json" \
-d '{"data": "Hello0World"}'
```

1) incorrect query
```sh
curl -X POST http://localhost:3000/api/data \
-H "Content-Type: application/json" \
-d '{"data": 506}'
```