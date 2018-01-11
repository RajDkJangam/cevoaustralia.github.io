FROM python:3.6

WORKDIR /usr/local/share/hugo
RUN wget -c https://github.com/gohugoio/hugo/releases/download/v0.27.1/hugo_0.27.1_Linux-64bit.tar.gz
RUN tar xvfz hugo_0.27.1_Linux-64bit.tar.gz
RUN mv ./hugo /usr/local/bin
RUN chmod +x /usr/local/bin/hugo
RUN hugo version
RUN pip install pygments
ADD setup_9.x setup_9.x
RUN bash ./setup_9.x
RUN apt-get update && apt-get install -y nodejs
