##  图像处理教程 https://zhuanlan.zhihu.com/p/30670165 安装库
# sudo pip3 install numpy      # 安装 numpy，用于在Python中进行科学计算
# sudo pip3 install scipy      # 安装 scipy, 跟 numpy 是一家的
# sudo pip3 install matplotlib # 安装 matplotlib，用于显示、绘图等
# sudo pip3 install opencv-python opencv-contrib-python # 安装 opencv
# sudo pip3 install scikit-image # 安装 scikit-iamge





import cv2
import numpy as np
img = cv2.imread("D:/data/cache/0080_1523518172775_0.jpg")

## BGR => Gray； 高斯滤波； Canny 边缘检测
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
gaussed = cv2.GaussianBlur(gray, (3,3), 0)
cannyed = cv2.Canny(gaussed, 10, 220)

## 将灰度边缘转化为BGR
cannyed2 = cv2.cvtColor(cannyed, cv2.COLOR_GRAY2BGR)

## 创建彩色边缘
mask = cannyed > 0             # 边缘掩模
canvas = np.zeros_like(img)    # 创建画布
canvas[mask] = img[mask]       # 赋值边缘

## 保存
res = np.hstack((img, cannyed2, canvas))   #　组合在一起　
cv2.imwrite("D:/data/cache/result.png", res)  # 保存

## 显示
cv2.imshow("canny in opencv ", res)

# 保持10s, 等待按键响应（超时或按键则进行下一步）
key = 0xFF & cv2.waitKey(1000*10)
if key in (ord('Q'), ord('q'), 27):
    ## 这部分用作演示用
    print("Exiting...")

## 销毁窗口
cv2.destroyAllWindows()