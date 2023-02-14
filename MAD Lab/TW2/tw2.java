package com.example.tw2;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;

public class MainActivity extends AppCompatActivity {

    String departments[] = new String[] { "CSE", "ISE", "EC", "EE", "ME", "CV", "MECH" };
    String name, usn, dept;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        EditText nameObj = (EditText) findViewById(R.id.name);
        EditText usnObj = (EditText) findViewById(R.id.usn);
        Spinner deptObj = (Spinner) findViewById(R.id.dept);
        Button btn = (Button) findViewById(R.id.submit);
        ArrayAdapter aa = new ArrayAdapter(this,
                com.google.android.material.R.layout.support_simple_spinner_dropdown_item, departments);
        aa.setDropDownViewResource(com.google.android.material.R.layout.support_simple_spinner_dropdown_item);
        deptObj.setAdapter(aa);
    }

    public void onSubmit(View view) {
        EditText nameObj = (EditText) findViewById(R.id.name);
        EditText usnObj = (EditText) findViewById(R.id.usn);
        Spinner deptObj = (Spinner) findViewById(R.id.dept);
        name = nameObj.getText().toString();
        usn = usnObj.getText().toString();
        dept = deptObj.getSelectedItem().toString();

        Intent i = new Intent(MainActivity.this, MainActivity2.class);
        i.putExtra("name_key", name);
        i.putExtra("usn_key", usn);
        i.putExtra("dept_key", dept);
        startActivity(i);
    }

}