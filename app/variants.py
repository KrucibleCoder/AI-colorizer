from pathlib import Path
import cv2


def generate_dummy_variants(input_path: Path, output_dir: Path) -> list[Path]:
    """
    Creates 3 dummy variants:
    1) contrast enhanced
    2) sharpened
    3) warm-ish tone
    """
    img = cv2.imread(str(input_path))
    if img is None:
        raise ValueError("Failed to read image (invalid image file).")

    variants = []

    # Variant 1: Contrast boost
    contrast = cv2.convertScaleAbs(img, alpha=1.3, beta=10)
    out1 = output_dir / f"{input_path.stem}_variant1_contrast.jpg"
    cv2.imwrite(str(out1), contrast)
    variants.append(out1)

    # Variant 2: Sharpen
    kernel = cv2.getGaussianKernel(9, 2)
    blur = cv2.filter2D(img, -1, kernel @ kernel.T)
    sharp = cv2.addWeighted(img, 1.5, blur, -0.5, 0)
    out2 = output_dir / f"{input_path.stem}_variant2_sharp.jpg"
    cv2.imwrite(str(out2), sharp)
    variants.append(out2)

    # Variant 3: Warm tone (increase red channel)
    warm = img.copy()
    warm[:, :, 2] = cv2.add(warm[:, :, 2], 25)  # add to red channel
    out3 = output_dir / f"{input_path.stem}_variant3_warm.jpg"
    cv2.imwrite(str(out3), warm)
    variants.append(out3)

    return variants