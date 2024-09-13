package com.example.demo;

import java.io.File;


public class Folder {
    public static void main(String[] args) {
        // Scanner sc = new Scanner(System.in);
        String path = "/home/rajat-bisht11/Downloads/demo/src/main/resourcesMyFolder/";
        
        // String name = sc.next();
        // path = path + name;
        File f = new File(path);

        String contents[] = f.list();
        for(int i=0; i<contents.length; i++) {
            System.out.println(contents[i]);
         }

        // if(f.mkdir()){
        //     System.out.println("Sucess");
        // }else{
        // System.out.println("fail");
        // }
        
    }
}
