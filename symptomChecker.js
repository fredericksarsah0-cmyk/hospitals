// PUIT24210078 HOSPITAL MANAGEMENT SYSTEM - First Aid & Symptom Triage Engine
// Matches user complaints to clinical first aid protocols, safe OTC drugs, dosages & emergency alerts

class SymptomAdvisor {
    constructor(knowledgebase) {
        this.kb = knowledgebase || FIRST_AID_KNOWLEDGEBASE;
        this.recentConsultations = [];
    }

    /**
     * Finds matches based on user's natural language complaint
     * @param {string} query - Free-text complaint entered by user
     * @returns {Array} List of matched condition objects with relevance score
     */
    analyzeComplaint(query) {
        if (!query || query.trim() === "") {
            return [];
        }

        const cleanQuery = query.toLowerCase().replace(/[^\w\s]/g, ' ');
        const tokens = cleanQuery.split(/\s+/).filter(w => w.length > 2);

        // Common stopwords to disregard
        const stopWords = new Set([
            "the", "and", "have", "with", "for", "that", "this", "been", "from",
            "just", "very", "feel", "feeling", "what", "drug", "drugs", "medicine",
            "take", "pain", "hurt", "hurts", "help", "please", "like", "when", "also"
        ]);

        const filteredTokens = tokens.filter(t => !stopWords.has(t));
        // If all tokens were filtered out, fallback to tokens
        const searchTokens = filteredTokens.length > 0 ? filteredTokens : tokens;

        const results = [];

        for (const item of this.kb) {
            let score = 0;

            // Direct title match
            const titleLower = item.title.toLowerCase();
            if (titleLower.includes(cleanQuery)) {
                score += 50;
            }

            // Keyword matches
            for (const kw of item.keywords) {
                const kwLower = kw.toLowerCase();
                if (cleanQuery.includes(kwLower)) {
                    score += 25;
                }
                for (const t of searchTokens) {
                    if (kwLower === t) {
                        score += 15;
                    } else if (kwLower.includes(t) || t.includes(kwLower)) {
                        score += 8;
                    }
                }
            }

            // Overview & Drug matches
            for (const t of searchTokens) {
                if (item.overview.toLowerCase().includes(t)) {
                    score += 4;
                }
                for (const d of item.drugs) {
                    if (d.name.toLowerCase().includes(t)) {
                        score += 10;
                    }
                }
            }

            if (score > 0) {
                results.push({
                    item,
                    score
                });
            }
        }

        // Sort descending by score
        results.sort((a, b) => b.score - a.score);

        // Log consultation if top result found
        if (results.length > 0) {
            this.recordConsultation(query, results[0].item);
        }

        return results;
    }

    /**
     * Finds a complaint by ID directly
     * @param {string} id
     */
    getComplaintById(id) {
        const found = this.kb.find(item => item.id === id);
        if (found) {
            this.recordConsultation(found.title, found);
        }
        return found;
    }

    /**
     * Records recent consultation into session memory
     */
    recordConsultation(query, condition) {
        const record = {
            id: 'REC-' + Date.now(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            query: query.length > 40 ? query.substring(0, 40) + '...' : query,
            conditionTitle: condition.title,
            urgency: condition.urgency,
            department: condition.recommendedDepartment
        };

        this.recentConsultations.unshift(record);
        if (this.recentConsultations.length > 10) {
            this.recentConsultations.pop();
        }
    }
}
