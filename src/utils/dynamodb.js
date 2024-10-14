import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-west-2" });
const docClient = DynamoDBDocumentClient.from(client);

export async function createItem(tableName, item) {
  const command = new PutCommand({
    TableName: tableName,
    Item: item,
  });

  try {
    await docClient.send(command);
    return item;
  } catch (error) {
    console.error("Error creating item:", error);
    throw error;
  }
}

export async function getItem(tableName, key) {
  const command = new GetCommand({
    TableName: tableName,
    Key: key,
  });

  try {
    const response = await docClient.send(command);
    return response.Item;
  } catch (error) {
    console.error("Error getting item:", error);
    throw error;
  }
}

export async function updateItem(
  tableName,
  key,
  updateExpression,
  expressionAttributeValues
) {
  const command = new UpdateCommand({
    TableName: tableName,
    Key: key,
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: "ALL_NEW",
  });

  try {
    const response = await docClient.send(command);
    return response.Attributes;
  } catch (error) {
    console.error("Error updating item:", error);
    throw error;
  }
}

export async function deleteItem(tableName, key) {
  const command = new DeleteCommand({
    TableName: tableName,
    Key: key,
  });

  try {
    await docClient.send(command);
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error;
  }
}
