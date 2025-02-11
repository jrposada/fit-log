import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const db = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.ITEMS_TABLE!;

// Create a new item
export const createItem: APIGatewayProxyHandler = async (event) => {
  try {
    const data = JSON.parse(event.body || "{}");
    if (!data.name) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing "name" in request body' }),
      };
    }
    const item = {
      id: uuidv4(),
      name: data.name,
    };
    await db
      .put({
        TableName: TABLE_NAME,
        Item: item,
      })
      .promise();
    return {
      statusCode: 201,
      body: JSON.stringify(item),
    };
  } catch (error) {
    console.error("createItem error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not create item" }),
    };
  }
};

// Get an item by id
export const getItem: APIGatewayProxyHandler = async (event) => {
  try {
    const { id } = event.pathParameters!;
    const result = await db
      .get({
        TableName: TABLE_NAME,
        Key: { id },
      })
      .promise();
    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Item not found" }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
  } catch (error) {
    console.error("getItem error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not retrieve item" }),
    };
  }
};

// Update an existing item
export const updateItem: APIGatewayProxyHandler = async (event) => {
  try {
    const { id } = event.pathParameters!;
    const data = JSON.parse(event.body || "{}");
    if (!data.name) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing "name" in request body' }),
      };
    }
    await db
      .update({
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression: "set #n = :name",
        ExpressionAttributeNames: { "#n": "name" },
        ExpressionAttributeValues: { ":name": data.name },
      })
      .promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ id, name: data.name }),
    };
  } catch (error) {
    console.error("updateItem error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not update item" }),
    };
  }
};

// Delete an item
export const deleteItem: APIGatewayProxyHandler = async (event) => {
  try {
    const { id } = event.pathParameters!;
    await db
      .delete({
        TableName: TABLE_NAME,
        Key: { id },
      })
      .promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Item deleted successfully" }),
    };
  } catch (error) {
    console.error("deleteItem error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not delete item" }),
    };
  }
};

// List all items
export const listItems: APIGatewayProxyHandler = async () => {
  try {
    const result = await db
      .scan({
        TableName: TABLE_NAME,
      })
      .promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    console.error("listItems error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not list items" }),
    };
  }
};
