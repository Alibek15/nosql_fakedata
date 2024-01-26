const mongoose = require("mongoose");
const { faker } = require ("@faker-js/faker");
mongoose.connect('mongodb://localhost:27017/', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
const customerSchema = new mongoose.Schema({
    customer_id: String,
    username: String,
    contact_info: String
});
const transactionItemsSchema = new mongoose.Schema({
    transaction:[{
    _id: String,
    date:Date,
    price: mongoose.Schema.Types.Decimal128,
    quantity: Number,
    customer_id: {
        type: String,
        ref:'Customer',
    }
}],
    
    items:[{
        items_id : String,
        quantity: Number,
        products:[{
            product_id : String,
            name: String,
            material: String,
            price: mongoose.Schema.Types.Decimal128,
            availability:Boolean,
        }]
    }
    ]

});
const Customer = mongoose.model('Customer', customerSchema);
const TransactionItems = mongoose.model('TransactionItems', transactionItemsSchema);
async function generateFakeData() {
    const customers = [];
    const transactionItems = [];

    for (let i = 0; i < 1000; i++) {
        const fakeCustomer = {
            customer_id: faker.string.uuid(),
            username: faker.internet.userName(),
            contact_info: faker.phone.number(),
        };
        const customer = await Customer.create(fakeCustomer);
        customers.push(customer);

        const fakeTransactionItem = {
            transaction: {
                date: faker.date.past(),
                price: faker.commerce.price(),
                quantity: faker.finance.amount(1,50,0),
                customer_id: customer._id,
            },
            items: [{
                items_id: faker.string.uuid(),
                quantity: faker.finance.amount(1,200,0),
                products: [{
                    product_id: faker.string.uuid(),
                    name: faker.commerce.productName(),
                    material: faker.commerce.productMaterial(),
                    price: faker.commerce.price(),
                    availability: faker.datatype.boolean(),
                }],
            }],
        };

        transactionItems.push(fakeTransactionItem);
    }

    await TransactionItems.insertMany(transactionItems);

    console.log('Данные успешно добавлены в базу данных.');
    mongoose.connection.close();
}

generateFakeData();