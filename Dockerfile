#FROM python:3
FROM dockerhub.cisco.com/broad-test-docker/broad-test-tng-base

# Set HTTPS_PROXY environment variable for deployments in the Cisco lab network
ARG HTTPS_PROXY=""
ENV HTTPS_PROXY ${HTTPS_PROXY}
ENV no_proxy=.cisco.com

#ADD ./ /broad-tests/
ENV PYTHONPATH ${PYTHONPATH}:/tng
ENV PATH ${PATH}:/usr/local/bin/tng

ADD test_calc.py  /
Add calc.py /
CMD ["/usr/local/bin/tng","run", "/test_calc.py"]



