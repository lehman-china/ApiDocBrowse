# -*- coding: utf-8 -*-
import time
import cv2
import numpy

from src.mytools.commons.utils.file_utils import FileUtils



# 水印去除教程  https://my.oschina.net/u/2400083/blog/732321
# sudo pip3 install numpy      # 安装 numpy，用于在Python中进行科学计算
# sudo pip3 install opencv-python opencv-contrib-python # 安装 opencv

'''
水印去除方法一
1. 基于 inpaint 方法（网上的方法，处理质量较低）
算法理论：基于Telea在2004年提出的基于快速行进的修复算法（FMM算法），先处理待修复区域边缘上的像素点，然后层层向内推进，直到修复完所有的像素点
处理方式：由ui人员制作出黑底白色水印且相同位置的水印蒙版图(必须单通道灰度图)，然后使用inpaint方法处理原始图像，具体使用时可把水印区放粗，这样处理效果会好点
'''
def watermark_clear1( src_path ,mask_path ,num=1 ):
    for i in range(num):
        src = cv2.imread(src_path)  # 默认的彩色图(IMREAD_COLOR)方式读入原始图像
        mask = cv2.imread(mask_path, cv2.IMREAD_GRAYSCALE)  # 灰度图(IMREAD_GRAYSCALE)方式读入水印蒙版图像

        # 参数：目标修复图像; 蒙版图（定位修复区域）; 选取邻域半径; 修复算法(包括INPAINT_TELEA/INPAINT_NS， 前者算法效果较好)
        dst = cv2.inpaint(src, mask, 3, cv2.INPAINT_TELEA)

        cv2.imwrite(src_path, dst)


'''
水印去除方法二
1. 基于像素的反色中和（处理质量较高）
参考自ps去水印原理，通过一张白底的反色水印图来中和原图水印
'''
def watermark_clear2( src_path ,mask_path):
    src = cv2.imread(src_path)
    mask = cv2.imread(mask_path)
    save = numpy.zeros(src.shape, numpy.uint8)  # 创建一张空图像用于保存

    for row in range(src.shape[0]):
        for col in range(src.shape[1]):
            for channel in range(src.shape[2]):
                if mask[row, col, channel] == 0:
                    val = 0
                else:
                    reverse_val = 255 - src[row, col, channel]
                    val = 255 - reverse_val * 256 / mask[row, col, channel]
                    if val < 0: val = 0

                save[row, col, channel] = val

    cv2.imwrite(src_path, save)




start_time = time.time()


files = FileUtils.loop_files('D:\\data\\')
for f in files:
    if f.__contains__('src2.jpg'):
        watermark_clear1('D:/data/test/src2.jpg','D:/data/test/mask.png' )


print(  "运行耗时 : "  )
print( time.time() - start_time  )




