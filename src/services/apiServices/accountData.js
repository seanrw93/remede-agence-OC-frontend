import testAccounts from "../../data/testData";

export const fetchAccountData = async () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(testAccounts), 300)
    });
}