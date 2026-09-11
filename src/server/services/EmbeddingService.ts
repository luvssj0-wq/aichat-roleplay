// Servicio de generación de embeddings
// Nota: Reemplazar con servicio real de embeddings (OpenAI, HuggingFace, etc)

export class EmbeddingService {
  /**
   * Genera un embedding para un texto
   * Actualmente usa una versión simulada
   * TODO: Integrar con OpenAI API o similar
   */
  async generateEmbedding(text: string): Promise<number[]> {
    // Simulación de embedding
    // En producción, usar API real como OpenAI's text-embedding-3-small
    const hash = this.simpleHash(text)
    const embedding: number[] = []
    
    for (let i = 0; i < 1536; i++) {
      embedding.push(
        Math.sin((hash + i) * 0.001) * 
        Math.cos((hash - i) * 0.001)
      )
    }
    
    return embedding
  }

  /**
   * Calcula similitud coseno entre dos embeddings
   */
  cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0

    let dotProduct = 0
    let normA = 0
    let normB = 0

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i]
      normA += a[i] * a[i]
      normB += b[i] * b[i]
    }

    normA = Math.sqrt(normA)
    normB = Math.sqrt(normB)

    if (normA === 0 || normB === 0) return 0
    return dotProduct / (normA * normB)
  }

  /**
   * Hash simple para simular embedding
   */
  private simpleHash(text: string): number {
    let hash = 0
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
    return Math.abs(hash)
  }
}

export default new EmbeddingService()
