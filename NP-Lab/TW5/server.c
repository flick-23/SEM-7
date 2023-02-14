/**
 * Step 1: Open Wireshark and locate and open loopback:lo.
Step 2: Go to the terminal and run the programs.
Step 3: Observe the packet capture in Wireshark.
Step 4: Go to Statistics -> Flow Graph, displays the sender and a receiver view of the packet                             flow.
Step 5: Go to Analyze -> Follow -> TCP stream, to follow the data stream.

*/
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
    struct sockaddr_in server, client;
    socklen_t clilen = sizeof(client);
    char buffer[1024];
    int listenfd = socket(AF_INET, SOCK_STREAM, 0);
    printf("[+]Server socket created successfully.\n");

    bzero(&server, sizeof(server));
    server.sin_family = AF_INET;
    server.sin_port = htons(PORT);
    server.sin_addr.s_addr = htonl(INADDR_ANY);

    bind(listenfd, (struct sockaddr *)&server, sizeof(server));
    printf("[+]Socket bound to port number %d.\n", PORT);
    listen(listenfd, 5);
    printf("[+]Listening...\n");
    int connfd = accept(listenfd, (struct sockaddr *)&client, &clilen);
    printf("[+]Connection established.\n");
    strcpy(buffer, "Hello");
    send(connfd, buffer, strlen(buffer), 0);
    printf("[+]\'%s\' has been transmitted.\n", buffer);
    printf("[+]Closing the connection.\n");
}