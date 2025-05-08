import { connectToDatabase } from ".";
import data from "../data";
import Product from "./models/product.model";
import { loadEnvConfig } from "@next/env";
import { cwd } from "process";
import User from "./models/user.model";

loadEnvConfig(cwd())
const main = async () => {
    try {
        const { products,users } = data
        await connectToDatabase(process.env.MONGODB_URI)

        await User.deleteMany()
        const createdUsers = await User.insertMany(users)

        await Product.deleteMany()
        const createdProducts = await Product.insertMany(products)

        console.log({
            createdUsers,
            createdProducts,
            message: "Seeded database successfully",
        })
        process.exit(0)
    }catch (error){
        console.log(error)
        throw new Error("Failed to seed database")
    }
}

main()
