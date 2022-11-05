# randomGrading

A simple app for asking random questions to your students

# Running

```
yarn install
yarn start

cd front
yarn install
yarn start
```

Front should be running in ports 5000 (front) and 5001 (back)

# Configuring students

create a `./front/src/students.mjs` file with this format:

```js
export const classes = {
  class1: [
    "Student 1",
    "Student 2",
    "Student 3",
    "Student 4",
    "Student 5",
    "Student 6",
    "Student 7",
    "Student 8",
    "Student 9",
    "Student 10",
    "Student 11",
    "Student 12",
  ],
};
```
