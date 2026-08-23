"""
Zero-Shot Classification using Facebook's BART
Completely local, no API calls, unlimited usage
"""
import logging

try:
    from transformers import pipeline
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    TRANSFORMERS_AVAILABLE = False

class LocalZeroShotClassifier:
    def __init__(self):
        if not TRANSFORMERS_AVAILABLE:
            self.classifier = None
            return
        try:
            self.classifier = pipeline(
                "zero-shot-classification",
                model="facebook/bart-large-mnli",
                device=-1
            )
            logging.info("✅ Local BART Zero-Shot Classifier Loaded")
        except Exception as e:
            logging.error(f"Failed to load zero-shot classifier: {e}")
            self.classifier = None

    def classify(self, text: str, categories: list) -> dict:
        """
        Classifies text into one of the given categories
        Returns: {'label': 'category_name', 'score': confidence}
        """
        if not self.classifier or not text or not categories:
            return {"label": "Other", "score": 0.0}
        
        try:
            result = self.classifier(
                text[:512],
                candidate_labels=categories,
                multi_label=False
            )
            
            return {
                "label": result['labels'][0],
                "score": round(result['scores'][0], 4),
                "all_scores": dict(zip(result['labels'], [round(s, 4) for s in result['scores']]))
            }
        except Exception as e:
            logging.error(f"Zero-shot classification error: {e}")
            return {"label": "Other", "score": 0.0}

# Global instance
local_classifier = LocalZeroShotClassifier()
