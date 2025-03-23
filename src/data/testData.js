export const testAccounts = [
    {accountName: "Checking", accountNumber: "x8939", balance: 2072.79, currency: "USD", description: "Available balance"},
    {accountName: "Savings", accountNumber: "x1234", balance: 10928.42, currency: "USD", description: "Available balance"},
    {accountName: "Credit Card", accountNumber: "x6247", balance: 184.47, currency: "USD", description: "Available balance"}
]

export const testTransactions = [
    {
        accountId: 0,
        transactions: [
            {date: new Date(2020, 6, 20), description: "Golden Bakery", amount: 5.00, balance: 2082.79 }
        ]
    }
]