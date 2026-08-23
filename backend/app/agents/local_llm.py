"""
Local Response Generation using GPT-2
Completely offline, no API quotas, unlimited usage
Fallback for when cloud API is unavailable
"""
import logging

try:
    from transformers import GPT2LMHeadModel, GPT2Tokenizer
    import torch
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    TRANSFORMERS_AVAILABLE = False

class LocalResponseGenerator:
    def __init__(self):
        if not TRANSFORMERS_AVAILABLE:
            self.model = None
            self.tokenizer = None
            return
        try:
            self.tokenizer = GPT2Tokenizer.from_pretrained('gpt2-medium')
            self.model = GPT2LMHeadModel.from_pretrained('gpt2-medium')
            self.model.eval()
            self.tokenizer.pad_token = self.tokenizer.eos_token
            logging.info("✅ Local GPT-2 Response Generator Loaded")
        except Exception as e:
            logging.error(f"Failed to load GPT-2 model: {e}")
            self.model = None
            self.tokenizer = None

    def generate_response(self, prompt: str, max_length: int = 150) -> str:
        """
        Generate a response using local GPT-2
        Returns: Generated text response
        """
        if not self.model or not self.tokenizer or not prompt:
            return "Thank you for contacting us. We are reviewing your issue."
        
        try:
            formatted_prompt = f"Customer Support Agent Response:\nCustomer Issue: {prompt}\nAgent: "
            inputs = self.tokenizer.encode(
                formatted_prompt,
                return_tensors='pt',
                max_length=512,
                truncation=True
            )
            
            with torch.no_grad():
                outputs = self.model.generate(
                    inputs,
                    max_length=max_length,
                    num_return_sequences=1,
                    temperature=0.7,
                    top_p=0.9,
                    do_sample=True,
                    pad_token_id=self.tokenizer.eos_token_id,
                    no_repeat_ngram_size=3
                )
            
            response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
            if "Agent: " in response:
                response = response.split("Agent: ")[-1].strip()
            
            return response if response else "Thank you for contacting us. We're reviewing your issue."
            
        except Exception as e:
            logging.error(f"Local response generation error: {e}")
            return "We appreciate your patience. Our team will address your concern shortly."

# Global instance
local_generator = LocalResponseGenerator()

def generate_local_response(prompt: str, max_length: int = 150) -> str:
    """Generate response using local GPT-2 model"""
    return local_generator.generate_response(prompt, max_length)
