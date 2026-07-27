"""Preprocessing and prediction, matching the training repo's validation transform
(dog_breed/model/train.py: Resize((224,224)) -> ToTensor -> ImageNet normalize)."""

import torch
import torch.nn as nn
import torch.nn.functional as F
from PIL import Image
from torchvision import transforms

IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]

preprocess = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
])


def predict(
    model: nn.Module,
    idx_to_breed: dict[int, str],
    image: Image.Image,
    device: torch.device,
    top_k: int = 3,
) -> list[dict]:
    """Run inference on a single PIL image. Returns [{"breed": str, "score": float}, ...]
    sorted by score descending, length top_k."""
    tensor = preprocess(image.convert("RGB")).unsqueeze(0).to(device)

    with torch.no_grad():
        logits = model(tensor)
        probs = F.softmax(logits, dim=1).squeeze(0)

    top_scores, top_indices = torch.topk(probs, top_k)

    return [
        {"breed": idx_to_breed[idx.item()], "score": score.item()}
        for score, idx in zip(top_scores, top_indices)
    ]
