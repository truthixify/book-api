import { DdcClient, FileUri } from "@cere-ddc-sdk/ddc-client";

export async function downloadFile(client: DdcClient, fileCid: string) {
  const uri = new FileUri(486928n, fileCid);

  const fileResponse = await client.read(uri);
  const content = await fileResponse.arrayBuffer();
}
