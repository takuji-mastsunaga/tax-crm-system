export function generateClientNumber(companyName: string, year: number): string {
  // 百万の位: 1=法人、2=個人
  const corporateKeywords = ["株", "有限", "合同", "会社", "法人", "団体"]
  const isCorporate = corporateKeywords.some(keyword => companyName.includes(keyword))
  const companyType = isCorporate ? "1" : "2"
  
  // 十万・万の位: 年度の下2桁
  const yearSuffix = year.toString().slice(-2)
  
  // 千〜1の位: ランダム4桁（実際は連番で管理）
  const sequentialNumber = Math.floor(Math.random() * 9999).toString().padStart(4, "0")
  
  return companyType + yearSuffix + sequentialNumber
}

export function getNextClientNumber(existingNumbers: string[], companyName: string, year: number): string {
  const corporateKeywords = ["株", "有限", "合同", "会社", "法人", "団体"]
  const isCorporate = corporateKeywords.some(keyword => companyName.includes(keyword))
  const companyType = isCorporate ? "1" : "2"
  const yearSuffix = year.toString().slice(-2)
  const prefix = companyType + yearSuffix
  
  // 既存の番号から同じプレフィックスのものを抽出
  const sameTypeNumbers = existingNumbers
    .filter(num => num.startsWith(prefix))
    .map(num => parseInt(num.slice(-4)))
    .sort((a, b) => a - b)
  
  // 次の連番を生成
  let nextSequence = 1
  for (const num of sameTypeNumbers) {
    if (num === nextSequence) {
      nextSequence++
    } else {
      break
    }
  }
  
  return prefix + nextSequence.toString().padStart(4, "0")
}