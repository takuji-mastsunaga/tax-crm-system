import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const firebaseAdminConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
}

function createFirebaseAdminApp() {
  if (getApps().length > 0) {
    return getApps()[0]!
  }

  // 開発環境またはキーが存在しない場合はプロジェクトIDのみで初期化
  if (!firebaseAdminConfig.clientEmail || !firebaseAdminConfig.privateKey) {
    console.log('Using minimal Firebase Admin initialization for development')
    return initializeApp({
      projectId: firebaseAdminConfig.projectId,
    })
  }

  return initializeApp({
    credential: cert(firebaseAdminConfig),
    projectId: firebaseAdminConfig.projectId,
  })
}

const firebaseAdmin = createFirebaseAdminApp()
export const adminDb = getFirestore(firebaseAdmin)
export default firebaseAdmin