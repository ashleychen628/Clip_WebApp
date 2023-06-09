
import torch
from PIL import Image
import open_clip
import os
import matplotlib.pyplot as plt
import matplotlib
import numpy as np
from open_clip import tokenizer
from torchvision.datasets import CIFAR100
# tokenizer = open_clip.get_tokenizer('ViT-B-32')
tokenizer.tokenize("Hello World!")
my_path = os.path.abspath(__file__)
UPLOAD_IMAGE_PATH = "../clip/src/uploaded_Images/calc_probabilities"
RESULT_IMAGE_PATH = "../clip/src/result_Images"
matplotlib.pyplot.switch_backend('Agg') 

model, _, preprocess = open_clip.create_model_and_transforms('ViT-B-32', pretrained='laion2b_s34b_b79k')

class Clip:
    def __init__(self, descriptions, setName):
        self.descriptions = descriptions
        self.setName = setName
        self.original_images = []
        # self.labels = []
        self.images = []
        # self.texts = []
    
    def setUpInput(self):
        for filename in [filename for filename in os.listdir(UPLOAD_IMAGE_PATH) if filename.endswith(".png") or filename.endswith(".jpg")]:

            image = Image.open(os.path.join(UPLOAD_IMAGE_PATH, filename)).convert("RGB")
            self.original_images.append(image)
            self.images.append(preprocess(image))
            # self.texts.append(descriptions[name])
    
    def getProbabilities(self):
        self.setUpInput()
        image_input = torch.tensor(np.stack(self.images))
        text_tokens = tokenizer.tokenize(["This is " + desc for desc in self.descriptions])
        
        with torch.no_grad():
            image_features = model.encode_image(image_input).float()
            text_features = model.encode_text(text_tokens).float()
            image_features /= image_features.norm(dim=-1, keepdim=True)
            text_features /= text_features.norm(dim=-1, keepdim=True)
            similarity = text_features.cpu().numpy() @ image_features.cpu().numpy().T

            text_probs = (100.0 * image_features @ text_features.T).softmax(dim=-1)
            text_probs = np.round(np.array(text_probs), 10).tolist()
            count = len(self.descriptions)

        plt.figure(figsize=(10, 12))
        plt.imshow(similarity, vmin=0.1, vmax=0.3)
        # plt.colorbar()
        plt.yticks(range(count), self.descriptions, fontsize=10)
        plt.xticks([])
        for i, image in enumerate(self.original_images):
            plt.imshow(image, extent=(i - 0.5, i + 0.5, -1.6, -0.6), origin="lower")
        for x in range(similarity.shape[1]):
            for y in range(similarity.shape[0]):
                plt.text(x, y, f"{similarity[y, x]:.2f}", ha="center", va="center", size=10)

        for side in ["left", "top", "right", "bottom"]:
            plt.gca().spines[side].set_visible(False)

        plt.xlim([-0.5, count - 0.5])
        plt.ylim([count + 0.5, -2])

        plt.title("Cosine similarity between text and image features", size=10)
        result_location = os.path.join(RESULT_IMAGE_PATH + "/calc_probabilities", 'probabilities.png')

        plt.tight_layout()
        plt.savefig(result_location)
        # print(text_probs)
        # TODO: add des set name
        return {
            "result_location":"probabilities.png",
            "label_probs": text_probs
        }
    

    def getImgClassification(self):
        """
        Classify images using the cosine similarity as the logits to the softmax operation.
        """
        # get the images
        self.setUpInput()

        image_input = torch.tensor(np.stack(self.images))
        # text_tokens = tokenizer(["This is" + desc for desc in descriptions])
        # text_descriptions = [f"A photo of a {label}" for label in cifar100.classes]
        # text_tokens = tokenizer.tokenize(text_descriptions)
        # cifar100 = CIFAR100(os.path.expanduser("~/.cache"), transform=preprocess, download=True)
        # print(cifar100.classes[0])
        text_tokens = tokenizer.tokenize(["This is " + desc for desc in self.descriptions])

        with torch.no_grad():
            image_features = model.encode_image(image_input)
            text_features = model.encode_text(text_tokens).float()
            image_features /= image_features.norm(dim=-1, keepdim=True)
            text_features /= text_features.norm(dim=-1, keepdim=True)

            # similarity = text_features.cpu().numpy() @ image_features.cpu().numpy().T
            text_probs = (100.0 * image_features @ text_features.T).softmax(dim=-1)
            top_probs, top_labels = text_probs.cpu().topk(5, dim=-1)
        
        plt.figure(figsize=(16, 16))

        for i, image in enumerate(self.original_images):
            plt.subplot(4, 4, 2 * i + 1)
            plt.imshow(image)
            plt.axis("off")

            plt.subplot(4, 4, 2 * i + 2)
            y = np.arange(top_probs.shape[-1])
            plt.grid()
            plt.barh(y, top_probs[i])
            plt.gca().invert_yaxis()
            plt.gca().set_axisbelow(True)
            # plt.yticks(y, [cifar100.classes[index] for index in top_labels[i].numpy()])
            plt.yticks(y, [self.descriptions[index] for index in top_labels[i].numpy()])
            plt.xlabel("probability")

        plt.subplots_adjust(wspace=0.5)
        result_location = os.path.join(RESULT_IMAGE_PATH + "/classify_Images", self.setName)

        plt.tight_layout()
        plt.savefig(result_location)

        

        return {
            "classify_location":"classifications.png"
        }