#include <stdio.h>
#include <sys/types.h>
#include <unistd.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <netdb.h>
#define SERV_TCP_PORT 5035
int main(int argc, char *argv[])
{
    int sockfd;
    struct sockaddr_in serv_addr;
    struct hostent *server;
    char buffer[4096];
    char buf[4096];
    sockfd = socket(AF_INET, SOCK_STREAM, 0);
    serv_addr.sin_family = AF_INET;
    // inet_pton(AF_INET,"127.0.0.1", &serv_addr.sin_addr);
    serv_addr.sin_addr.s_addr = inet_addr("127.0.0.1");
    serv_addr.sin_port = htons(SERV_TCP_PORT);
    printf("\nReady for sending...");
    connect(sockfd, (struct sockaddr *)&serv_addr, sizeof(serv_addr));
    printf("\nEnter the message to send\n");
    printf("\nClient: ");
    fgets(buffer, 4096, stdin);
    write(sockfd, buffer, 4096);
    read(sockfd, &buf, 4096);
    printf("Server echo Rxd  :%s", buf);
    printf("\n");
    close(sockfd);
    return 0;
}