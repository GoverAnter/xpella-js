<template>
  <div id="app">
    <vue-prism-editor v-model="code" language="java" :line-numbers="true"></vue-prism-editor>
    <button @click="compile">Compile code</button>
    <div v-if="error">
      <div>{{ error }}</div>
      <div style="white-space: pre;">{{ error.stack }}</div>
    </div>
    <div v-show="program">
      Main methods :
      <ul>
        <li v-for="(type, index) in mainMethods" :key="index">{{ type }}</li>
      </ul>
    </div>
    <div style="white-space: pre;">{{ ast }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { XpellaParser } from '../../src/Parser/XpellaParser';
import VuePrismEditor from 'vue-prism-editor';
import 'prismjs';
import 'vue-prism-editor/dist/VuePrismEditor.css'; // import the styles
import { XpellaASTProgram } from '../../src/AST/XpellaASTProgram';

@Component({ components: { VuePrismEditor }})
export default class App extends Vue {
  // tslint:disable-next-line
  public code: string = 'class OtherTest {\n  public static int q = 2;\n  public int getInt(int w = 2) {\n    return 10 + w;\n  }\n}\n\nclass Test {\n  public int i = 0;\n  public int testSomething(int z) {\n    z = this.i + 1 + OtherTest.q;\n    this.i += z * 2;\n    OtherTest oTest = new OtherTest();\n    return z * oTest.getInt();\n  }\n  public static void main() {\n    Test test = new Test();\n    int result = test.testSomething(20);\n    if (result == 72 && test.i == 6) {\n      return;\n    }\n    else {\n      return;\n    }\n  }\n}';
  public program: XpellaASTProgram = null;
  public ast: string = '';
  public error: Error = null;

  get mainMethods(): string[] {
    return this.program ? this.program.getMainMethodTypes().map((t) => t + '.main()') : [];
  }

  public compile(): void {
    this.ast = '';
    this.program = null;
    this.error = null;
    const parser = new XpellaParser(this.code);
    try {
      this.program = parser.executeParse();
      this.ast = JSON.stringify(this.program, null, 2);
    } catch (e) {
      this.error = e;
    }
  }
}
</script>
