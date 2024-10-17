import { error } from "console";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { json } from "stream/consumers";
import { isNameValid } from "./lib/validators";

const app = new Hono();

app.use("/*", cors());

let students = [
  { id: "1", name: "Ola Normann" },
  { id: "2", name: "Kari Normann" },
];

app.get("/api/students", (c) => {
  return c.json(students)
})

app.get("/api/student/:id", (c) => {
  const id = c.req.param("id")
  const student = students.filter((student) => student.id === id)
 return c.json(student); 
})

app.post("/api/student/", async(c) => {
  const data = await c.req.json()
  const {name} = data as {name: string}
  //early return principle 
  if (!isNameValid(name)){
    return c.json({success: false, error: "Invalid name"}, {status: 400})
  }
  students.push({id: crypto.randomUUID(), name})
  return c.json({success: true, data: students}, {status:201})
})

app.delete("/api/student/:id", (c) => {
  const id =  c.req.param("id")
  students = students.filter(
    (student) => student.id == id
  )
  //vanlighvis retunerer vi id til studnet eller 204 no content 
  return c.json(students)
})


app.patch("/api/student/:id", async (c) => {
  const id = c.req.param("id")
  const {name } = await c.req.json()
  students = students.map(
    (student) => student.id == id ? {...student, name} : student
  )
  return c.json(students)
})

app.onError((err, c) => {
  console.error(err);

  return c.json(
    {
      error: {
        message: err.message,
      },
    },
    { status: 500 }
  );
});

export default app;
