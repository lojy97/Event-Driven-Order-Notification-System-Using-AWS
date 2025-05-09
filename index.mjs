import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });

export const handler = async (event) => {
  for (const record of event.Records) {
    try {
      
      const snsEnvelope = JSON.parse(record.body);
      console.log("SNS envelope:", snsEnvelope);

      
      const message = JSON.parse(snsEnvelope.Message);
      console.log("Parsed order message:", message);

      
      if (!message.orderId) {
        throw new Error("Missing required field: orderId");
      }

      const item = {
        orderId: message.orderId,
        userId: message.userId,
        itemName: message.itemName,
        quantity: message.quantity,
        status: message.status,
        timestamp: message.timestamp
      };

      const command = new PutItemCommand({
        TableName: "Orders",
        Item: marshall(item, { removeUndefinedValues: true })
      });

      await client.send(command);
      console.log("✅ Order saved to DynamoDB:", item);
    } catch (err) {
      console.error("❌ Error processing order:", err);
    }
  }
};
