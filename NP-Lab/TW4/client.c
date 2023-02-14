/**
 * Steps:
Step 1: Open Wireshark and locate and open loopback:lo.
Step 2: Go to the terminal and run the programs.
Step 3: Observe the packet capture in Wireshark.
Step 4: Go to Statistics -> Flow Graph, displays the sender and a receiver view of the packet flow.
*/
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#define PORT 8080
int main(int argc, char **argv)
{
    if (argc != 2)
    {
        printf("Usage: %s <port>\n", argv[0]);
        exit(0);
    }
    int port = atoi(argv[1]);
    struct sockaddr_in server;
    char buffer[1024];
    int sockfd = socket(AF_INET, SOCK_DGRAM, 0);
    printf("[+]Client Socket Created Successfully.\n");
    bzero(&server, sizeof(server));
    server.sin_family = AF_INET;
    server.sin_port = htons(port);
    server.sin_addr.s_addr = htonl(INADDR_ANY);
    strcpy(buffer, "Hello World!");
    sendto(sockfd, buffer, 1024, 0, (struct sockaddr *)&server, sizeof(server));
    printf("[+]Data sent : %s\n", buffer);
    socklen_t servlen = sizeof(server);
    bzero(buffer, 1024);
    recvfrom(sockfd, buffer, 1024, 0, (struct sockaddr *)&server, &servlen);
    printf("[+]Data received: %s\n", buffer);
}
