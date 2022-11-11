#include<netinet/in.h>
#include<sys/socket.h>
#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include<time.h>

int main() {
	struct sockaddr_in sa, cli;
	int n, sockfd;
	int len;
	char buff[100];
	sockfd = socket(AF_INET, SOCK_STREAM, 0);
	if (sockfd < 0)
		printf("Error in Socket\n");
	else
		printf("Socket is opened\n");
	bzero(&sa, sizeof(sa));
	sa.sin_family = AF_INET;
	sa.sin_port=htons(5600);
	if (connect(sockfd, (struct sockaddr *) &sa, sizeof(sa)) < 0 ) {
		printf("Error in connection failed\n");
		exit(0);
	}
	else
		printf("Connected successfully\n");
	if (n = read(sockfd, buff, sizeof(buff)) < 0) {
		printf("Error in Reading\n");
		exit(0);
	}
	else {
		printf("Message Read %s", buff);
	}
}
