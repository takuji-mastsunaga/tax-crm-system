function generateClientNumber(companyName, year = new Date().getFullYear()) {
  const corporateKeywords = ["株", "有限", "合同", "会社", "法人", "団体"]
  const isCorporate = corporateKeywords.some(keyword => companyName.includes(keyword))
  const companyType = isCorporate ? "1" : "2"
  const yearSuffix = year.toString().slice(-2)
  const sequentialNumber = Math.floor(Math.random() * 9999).toString().padStart(4, "0")
  return companyType + yearSuffix + sequentialNumber
}

// テスト実行
console.log("=== 顧客番号生成システムテスト ===")
console.log("株式会社A:", generateClientNumber("株式会社A"))
console.log("B商事株式会社:", generateClientNumber("B商事株式会社"))
console.log("山田太郎(個人):", generateClientNumber("山田太郎"))
console.log("C工業有限会社:", generateClientNumber("C工業有限会社"))
console.log("田中事業所:", generateClientNumber("田中事業所"))