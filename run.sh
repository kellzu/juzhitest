#!/bin/bash

# Apps Info
# 应用存放地址
APP_HOME=/home/admin/www
APP_CODE_HOME=/home/admin/code/mall_web
# 应用名称
APP_NAME=mall-web

# Shell Info 

# 使用说明，用来提示输入参数
usage() {
    echo "Usage: sh run [update]"
    exit 1
}

pull() {
  echo "switch APP HOME:${APP_CODE_HOME}"
  cd $APP_CODE_HOME
  git pull
  if [ $? != 0 ]; then
    echo "git拉取源代码失败"
    exit 1
  fi
  echo "pull complete..."
}

# 拉取最新代码，打包
build() {
  cd $APP_CODE_HOME
  yarn install
  if [ $? != 0 ]; then
    echo "安装依赖包失败，请重新再试"
    exit 0
  fi
  npm run build
  if [ $? != 0 ]; then
    echo "编译失败，请重新再试"
    exit 0
  fi
  cd dist/
  cp -r * $APP_HOME
  echo "打包替换执行文件完成"
}


case $1 in
"update")
        pull
        build
        ;;
        *)
        usage
        ;;
esac
exit 0