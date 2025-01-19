import * as fs from "fs";
import { DdcClient, File, TESTNET, FileUri } from "@cere-ddc-sdk/ddc-client";

export async function uploadFile(filePath: any) {
  const client = await DdcClient.create(
    String(process.env.SEED_PHRASE),
    TESTNET,
  );
  const bucketId = 486928n;

  const fileStats = fs.statSync(filePath);
  const fileStream = fs.createReadStream(filePath);
  const file = new File(fileStream, { size: fileStats.size });

  const { cid: fileCid } = await client.store(bucketId, file);

  const fileUri = new FileUri(bucketId, fileCid);

  const fileUrl = `https://storage.testnet.cere.network/${bucketId}/${fileUri.cid}`;

  return { cid: fileCid, url: fileUrl };
}
