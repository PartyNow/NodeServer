FROM node

RUN echo "Asia/Shanghai" > /etc/timezone \
    && dpkg-reconfigure -f noninteractive tzdata

RUN mkdir -p /opt/partynow
WORKDIR /opt/partynow
COPY . /opt/partynow

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]