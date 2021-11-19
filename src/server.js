const express = require('express');
const { v4: uuidv4 } = require('uuid')

const app = express();

app.use(express.json());

const customers = []

//middleware

function verifyIfExistsAccountCPF(request, response, next) {
  const { cpf } = request.params
  const customer = customers.find(c => c.cpf === cpf)
  if (!customer) {
    return response.status(400).json({ error: 'Customer not found' })
  }
  request.customer = customer

  return next()
}


app.post("/account", (req, res) =>  {
  const { name, cpf } = req.body;
  

  const customerAlreadyExists = customer.some(
    (customer) => customer.cpf === cpf
  );

  if (customerAlreadyExists) {
    return response.status(400).json({ error: "Customer already exists" });
  }

  
  customers.push({
    cpf,
    name,
    id: uuidv4(),
    statement: []
  })

  return response.status(201).send
})

app.get("/statement/", verifyIfExistsAccountCPF, (request, response) => {
  const { customer } = request


  return res.json(customer.statement);

})

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});