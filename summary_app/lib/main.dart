import 'package:flutter/material.dart';

/// Flutter code sample for [NavigationDrawer].

void main() => runApp(const NavigationDrawerApp());

class NavigationDrawerApp extends StatelessWidget {
  const NavigationDrawerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Scaffold(
        appBar: AppBar(
          title: Text('Drawer Demo'),
          backgroundColor: Color(0xFF3F51B5),
        ),
        body: Container(
          height: 150,
          padding: EdgeInsets.all(20),
          child: Row(
            children: [
              Image.asset('assets/lion.jpg', width: 150),
              Container(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Lion'),

                    Text('Lion'),
                    Text('1111  5'),

                    Row(
                      children: [
                        Text('Lion'),
                        Icon(Icons.star, color: Colors.amber),
                        Text('Lion'),
                      ],
                    ),
                  ],
                ),
              ),
              // Flexible(
              //   flex: 3,
              //   child: Container(color: Color.fromARGB(255, 37, 185, 7)),
              // ),
              // Flexible(
              //   flex: 7,
              //   child: Container(color: Color.fromARGB(255, 148, 16, 16)),
              // ),
            ],
          ),
        ),
      ),
    );
  }
}
