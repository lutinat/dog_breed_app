"""Model architecture and checkpoint loading for the dog breed classifier."""

import torch
import torch.nn as nn
from torchvision import models


def build_model(num_classes: int) -> nn.Module:
    """Recreate the ResNet50 architecture used at training time."""
    model = models.resnet50(weights=None)
    model.fc = nn.Linear(model.fc.in_features, num_classes)
    return model


def load_model(checkpoint_path: str, device: torch.device) -> tuple[nn.Module, dict[int, str]]:
    """Load the trained checkpoint. Returns the model in eval mode and an idx -> breed name map."""
    checkpoint = torch.load(checkpoint_path, map_location=device, weights_only=False)
    breed_to_idx = checkpoint["breed_to_idx"]
    idx_to_breed = {idx: breed for breed, idx in breed_to_idx.items()}

    model = build_model(num_classes=len(breed_to_idx))
    model.load_state_dict(checkpoint["model_state_dict"])
    model.to(device)
    model.eval()

    return model, idx_to_breed
