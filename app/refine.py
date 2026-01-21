import cv2
import numpy as np


def guided_filter_gray(I: np.ndarray, p: np.ndarray, r: int = 8, eps: float = 1e-3) -> np.ndarray:
    """
    Guided filter for grayscale guidance.

    I: guidance image (H,W) float32 in [0,1]
    p: filtering input image (H,W) float32 (recommended in small range for stability)
    r: radius
    eps: regularization
    """
    k = (2 * r + 1, 2 * r + 1)

    mean_I = cv2.boxFilter(I, ddepth=-1, ksize=k)
    mean_p = cv2.boxFilter(p, ddepth=-1, ksize=k)
    mean_Ip = cv2.boxFilter(I * p, ddepth=-1, ksize=k)
    cov_Ip = mean_Ip - mean_I * mean_p

    mean_II = cv2.boxFilter(I * I, ddepth=-1, ksize=k)
    var_I = mean_II - mean_I * mean_I

    a = cov_Ip / (var_I + eps)
    b = mean_p - a * mean_I

    mean_a = cv2.boxFilter(a, ddepth=-1, ksize=k)
    mean_b = cv2.boxFilter(b, ddepth=-1, ksize=k)

    q = mean_a * I + mean_b
    return q


def refine_ab_with_guided_filter(
    L: np.ndarray,
    ab: np.ndarray,
    *,
    radius: int = 8,
    eps: float = 1e-3,
    chroma_blur_sigma: float = 1.0,
) -> np.ndarray:
    """
    Refine the predicted chroma (ab) using original luminance edges.

    L: (H,W) L channel in LAB space (0..100)
    ab: (H,W,2) predicted ab (float32)
    radius: guided filter radius
    eps: guided filter epsilon
    chroma_blur_sigma: pre-blur on chroma to stabilize blobs (0 disables)
    """
    # Guidance image (0..1)
    I = (L / 100.0).astype("float32")

    # Optional mild pre-blur on chroma to stabilize chroma blobs
    if chroma_blur_sigma and chroma_blur_sigma > 0:
        ab = cv2.GaussianBlur(ab, (0, 0), chroma_blur_sigma)

    a_chan = ab[:, :, 0].astype("float32")
    b_chan = ab[:, :, 1].astype("float32")

    # Normalize ab channels for stability during filtering
    scale = 128.0
    a_norm = a_chan / scale
    b_norm = b_chan / scale

    a_ref = guided_filter_gray(I, a_norm, r=radius, eps=eps)
    b_ref = guided_filter_gray(I, b_norm, r=radius, eps=eps)

    refined = np.stack([a_ref * scale, b_ref * scale], axis=2).astype("float32")
    return refined