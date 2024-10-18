import { API } from "aws-amplify";

export async function createItem(tableName, item) {
  try {
    await API.post("apiName", `/items`, { body: item });
    return item;
  } catch (error) {
    console.error("Error creating item:", error);
    throw error;
  }
}

export async function getItem(tableName, key) {
  try {
    const response = await API.get("apiName", `/items/${key.id}`);
    return response;
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
  try {
    const response = await API.put("apiName", `/items/${key.id}`, {
      body: expressionAttributeValues,
    });
    return response;
  } catch (error) {
    console.error("Error updating item:", error);
    throw error;
  }
}

export async function deleteItem(tableName, key) {
  try {
    await API.del("apiName", `/items/${key.id}`);
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error;
  }
}
