#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#define PORT 4444
void main()
{
    int client = socket(AF_INET, SOCK_STREAM, 0);
    char buffer[1024];
    struct sockaddr_in server;
    printf("[+]Client Socket Created Successfully.\n");
    bzero(&server, sizeof(server));
    server.sin_family = AF_INET;
    server.sin_port = htons(PORT);
    server.sin_addr.s_addr = htonl(INADDR_ANY);
    connect(client, (struct sockaddr *)&server, sizeof(server));
    printf("[+]Connected to Server.\n");
    recv(client, buffer, 1024, 0);
    printf("[+]Data Received from Server : %s\n", buffer);
    printf("[+]Closing the connection.\n");
}