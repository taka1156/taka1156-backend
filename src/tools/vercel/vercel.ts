import { put, list, PutCommandOptions } from '@vercel/blob';

const blobName = 'counters.json';

interface Counter {
  viewer: number;
}

const storeConfig: PutCommandOptions = {
  contentType: 'application/json',
  access: 'public',
  allowOverwrite: true,
}

// 初期化処理
const initializeCounter = async (): Promise<void> => {
  try {
    const initialData: Counter = { viewer: 0 };
    await put(blobName, JSON.stringify(initialData), storeConfig);
    console.log(`Blob '${blobName}' initialized!`);
  } catch (error) {
    console.error('Initialization error:', error);
  }
};

// ファイルがないときだけ実行
const ensureBlobExists = async (): Promise<void> => {
  try {
    const blobs = await list();
    const blob = blobs.blobs.find(b => b.pathname === blobName);

    if (!blob) {
      console.log(`Blob '${blobName}' not found. Initializing...`);
      await initializeCounter();
    } else {
      console.log(`Blob '${blobName}' already exists.`);
    }
  } catch (error) {
    console.error('Ensure Blob Error:', error);
  }
};

const resolveBlob = async (response: Response) => {
  try {
    const blobData = await response.json();
    return blobData
  } catch (error) {
    console.error('Failed to parse JSON:', error);
  }
}

const incrementViewer = async (viewer: number): Promise<void> => {
  // 存在チェックし、なければ実行
  ensureBlobExists();

  try {
    // Blobをリストから取得する
    const blobs = await list();
    const blob = blobs.blobs.find(b => b.pathname === blobName);

    if (!blob) throw new Error(`Blob '${blobName}' not found`);

    const response = await fetch(blob.url);
    const blobData = await resolveBlob(response);

    // 型を明示的に指定（キャスト）
    const counter: Counter = blobData as Counter;

    // 更新
    counter.viewer = viewer;

    await put(blobName, JSON.stringify(counter), storeConfig);
    console.log('updated viewer')
  } catch (error) {
    console.error('Update error:', error);
  }
};

// 閲覧数の取得
const getViewerCount = async (): Promise<number> => {
  try {
    const blobs = await list();
    const blob = blobs.blobs.find(b => b.pathname === blobName);

    if (!blob) throw new Error(`Blob '${blobName}' not found`);

    const response = await fetch(blob.url);
    const blobData = await resolveBlob(response);

    return blobData.viewer || 0;
    console.log('read viewer')
  } catch (error) {
    console.error('Fetch error:', error);
    return 0;
  }
};

export default {
  add: async (viewer: string): Promise<void> =>
    await incrementViewer(Number(viewer)),
  read: async (): Promise<number> => await getViewerCount(),
};
