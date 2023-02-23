/* Assignment 4: So You Think Ants Can Dance
 * CSCI 4611, Fall 2022, University of Minnesota
 * Instructor: Evan Suma Rosenberg <suma@umn.edu>
 * License: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 */ 

import * as gfx from 'gophergfx'
import { Skeleton } from './Skeleton'
import { MotionClip } from './MotionClip'
import { Pose } from './Pose';
import { Bone } from './Bone';
import { CylinderMesh, GouraudMaterial, MeshInstance, SphereMesh } from 'gophergfx';

export class AnimatedCharacter extends gfx.Transform3
{
    public skeleton: Skeleton;
    public fps: number;
    public useAbsolutePosition: boolean;
    
    private clip: MotionClip | null;
    
    private currentTime: number;
    private currentPose: Pose;
    
    private overlayQueue: MotionClip[];
    private overlayTransitionFrames: number[];
    private overlayTime: number;
    private overlayPose: Pose;

    constructor(fps = 60, useAbsolutePosition = true)
    {
        super();
        
        // Create skeleton and add it as a child
        this.skeleton = new Skeleton();
        this.add(this.skeleton);

        this.fps = fps;
        this.useAbsolutePosition = useAbsolutePosition;

        this.clip = null;

        this.currentTime = 0;
        this.currentPose = new Pose();
        
        this.overlayQueue = [];
        this.overlayTransitionFrames = [];
        this.overlayTime = 0;  
        this.overlayPose = new Pose();
    }

    createMeshes(): void
    {
        // Drawing the coordinate axes is a good way to check your work.
        // To start, this will just create the axes for the root node of the
        // character, but once you add this to createMeshesRecursive, you 
        // can draw the axes for each bone.  The visibility of the axes
        // is toggled using a checkbox.
        const axes = new gfx.Axes3(0.15);
        this.skeleton.add(axes);

        // Call the recursive method for each root bone
        this.skeleton.rootBones.forEach((rootBone: Bone) => {
            this.createMeshesRecursive(rootBone)
        });
    }

    private createMeshesRecursive(bone: Bone): void
    {
        // TO DO (PART 1): Draw the coordinate axes for the bone
        const axes = new gfx.Axes3(0.15);
        axes.lookAt(bone.direction);
        bone.transform.add(axes);

        // TO DO (PART 3): You will want to draw something different for each
        // part of the body. An if statement like this is an easy way
        // to do that.  You can find the names of additional bones in 
        // the .asf files.  Anything that you create will be automatically
        // be made invisible when the coordinate axes are visibile.
        const bodyMaterial = new gfx.PhongMaterial();
        bodyMaterial.ambientColor.set(1, 0, 0);
        const limbMaterial = new gfx.GouraudMaterial();
        limbMaterial.ambientColor.set(0, 0, 0);
        if(bone.name == 'head'){
            const head = new gfx.SphereMesh(bone.length);
            head.scale.set(1, 2, 1);
            head.translateZ(bone.length);
            head.rotateX(100);
            head.material.setColor(bodyMaterial.ambientColor);

            const eye = new gfx.SphereMesh(0.015);
            const eyeMaterial = new GouraudMaterial();
            eyeMaterial.ambientColor.set(1, 1, 1);
            eye.material.setColor(eyeMaterial.ambientColor);
            const eyeL = new MeshInstance(eye);
            const eyeR = new MeshInstance(eye);
            eyeL.translateZ(bone.length);
            eyeR.translateZ(bone.length);
            eyeL.translateX(bone.length/2);
            eyeR.translateX(bone.length/10);
            eyeL.translateY(bone.length/3);
            eyeR.translateY(bone.length/3);

            const nose = new gfx.SphereMesh(0.01);
            nose.material.setColor(bodyMaterial.ambientColor);
            nose.translateZ(bone.length/5);
            nose.translateY(-bone.length);
            nose.translateX(bone.length/10);
            
            const antenna = new gfx.ConeMesh(0.025, bone.length);
            const antennaT = new gfx.ConeMesh(0.015, bone.length);
            antennaT.translateY(bone.length*0.15);
            antennaT.translateZ(bone.length*.5);
            antennaT.rotateX(90);
            antenna.add(antennaT);
            antenna.translateX(bone.length/2);
            antenna.translateY(bone.length*1.15);
            antenna.translateZ(bone.length/6);

            antenna.material.setColor(limbMaterial.ambientColor);
            antennaT.material.setColor(limbMaterial.ambientColor);

            const antennaR = new gfx.ConeMesh(0.025, bone.length);
            const antennaTR = new gfx.ConeMesh(0.015, bone.length);
            antennaTR.translateY(bone.length*0.15);
            antennaTR.translateZ(bone.length*.5);
            antennaTR.rotateX(90);
            antennaR.add(antennaTR);
            antennaR.translateX(-bone.length/2);
            antennaR.translateY(bone.length*1.15);
            antennaR.translateZ(bone.length/6);

            antennaR.material.setColor(limbMaterial.ambientColor);
            antennaTR.material.setColor(limbMaterial.ambientColor);
            
            head.add(eyeL);
            head.add(eyeR);
            head.add(nose);
            head.add(antenna);
            head.add(antennaR);
            bone.transform.add(head);
        }
        else if(bone.name == 'upperneck'){
            const neck = new gfx.BoxMesh(0.015, bone.length, 0.015);
            if(bone.name == 'upperneck'){
                neck.translateY(-bone.length/2);
            }
            neck.material.setColor(limbMaterial.ambientColor);
            neck.translateZ(bone.length/2);
            bone.transform.add(neck);
        }
        else if(bone.name == 'upperback' || bone.name == 'lowerback' || bone.name == 'thorax'){
            const back = new gfx.SphereMesh(bone.length);
            if(bone.name == 'lowerback'){
                back.scale.set(1, 3, 1);
                back.translateY(-bone.length*1.5);
                back.translateZ(-bone.length/2);
                back.rotateX(60);
            }
            back.material.setColor(bodyMaterial.ambientColor);
            bone.transform.add(back);
        }
        else{
            const drawBone = new gfx.BoxMesh(0.025, 0.015, bone.length);
          
            drawBone.lookAt(bone.direction);
            drawBone.translateZ(bone.length/2);
            drawBone.material.setColor(limbMaterial.ambientColor);
            bone.transform.add(drawBone);
        }

        // TO DO (PART 1): Recursively call this function for each of the bone's children
        bone.children.forEach((child: Bone)=>{
            this.createMeshesRecursive(child);
        })
        
    }

    loadSkeleton(filename: string): void
    {
        this.skeleton.loadFromASF(filename);
    }

    loadMotionClip(filename: string): MotionClip
    {
        const clip = new MotionClip();
        clip.loadFromAMC(filename, this.skeleton);
        return clip;
    }

    play(clip: MotionClip): void
    {
        this.stop();
        this.clip = clip;
        this.currentPose = this.clip.frames[0];
    }

    stop(): void
    {
        this.clip = null;
        this.currentTime = 0;

        this.overlayQueue = [];
        this.overlayTransitionFrames = [];
        this.overlayTime = 0;
    }

    overlay(clip: MotionClip, transitionFrames: number): void
    {
        this.overlayQueue.push(clip);
        this.overlayTransitionFrames.push(transitionFrames);
    }

    update(deltaTime: number): void
    {
        // If the motion queue is empty, then do nothing
        if(!this.clip)
            return;

        // Advance the time
        this.currentTime += deltaTime;

        // Set the next frame number
        let currentFrame = Math.floor(this.currentTime * this.fps);

        if(currentFrame >= this.clip.frames.length)
        {
            currentFrame = 0;
            this.currentTime = 0;   
            this.currentPose = this.clip.frames[0];
        }

        let overlayFrame = 0;

        // Advance the overlay clip if there is one
        if(this.overlayQueue.length > 0)
        {
            this.overlayTime += deltaTime;

            overlayFrame = Math.floor(this.overlayTime * this.fps);

            if(overlayFrame >= this.overlayQueue[0].frames.length)
            {
                this.overlayQueue.shift();
                this.overlayTransitionFrames.shift();
                this.overlayTime = 0;
                overlayFrame = 0;
            }
        }

        const pose = this.computePose(currentFrame, overlayFrame);
        this.skeleton.update(pose, this.useAbsolutePosition);
    }

    public getQueueCount(): number
    {
        return this.overlayQueue.length;
    }

    private computePose(currentFrame: number, overlayFrame: number): Pose
    {
        // If there is an active overlay track
        if(this.overlayQueue.length > 0)
        {
            // Start out with the unmodified overlay pose
            const overlayPose = this.overlayQueue[0].frames[overlayFrame].clone();

            let alpha = 0;

            // Fade in the overlay
            if(overlayFrame < this.overlayTransitionFrames[0])
            {
                alpha = 1 - overlayFrame / this.overlayTransitionFrames[0];
                overlayPose.lerp(this.clip!.frames[currentFrame], alpha);
            }
            // Fade out the overlay
            else if (overlayFrame > this.overlayQueue[0].frames.length - this.overlayTransitionFrames[0])
            {
                alpha = 1 - (this.overlayQueue[0].frames.length - overlayFrame) / this.overlayTransitionFrames[0];
                overlayPose.lerp(this.clip!.frames[currentFrame], alpha);
            }

            if(!this.useAbsolutePosition)
            {
                const relativeOverlayPosition = gfx.Vector3.copy(this.overlayQueue[0].frames[overlayFrame].rootPosition);
                relativeOverlayPosition.subtract(this.overlayPose.rootPosition);

                const relativePosition = gfx.Vector3.copy(this.clip!.frames[currentFrame].rootPosition);
                relativePosition.subtract(this.currentPose.rootPosition);

                relativeOverlayPosition.lerp(relativeOverlayPosition, relativePosition, alpha);
                this.position.add(relativeOverlayPosition);

                this.overlayPose = this.overlayQueue[0].frames[overlayFrame];
                this.currentPose = this.clip!.frames[currentFrame];
            }
            
            return overlayPose;
        }
        // Motion is entirely from the base track
        else
        {
            if(!this.useAbsolutePosition)
            {
                const relativePosition = gfx.Vector3.copy(this.clip!.frames[currentFrame].rootPosition);
                relativePosition.subtract(this.currentPose.rootPosition);
                this.position.add(relativePosition);
                this.currentPose = this.clip!.frames[currentFrame];
            }

            return this.clip!.frames[currentFrame];
        }
    }

    // Entry function for the recursive call
    toggleAxes(showAxes: boolean): void
    {
        this.toggleAxesRecursive(this.skeleton, showAxes);
    }

    private toggleAxesRecursive(object: gfx.Transform3, showAxes: boolean): void
    {
        // Set the visibility of the coordinate axes
        if(object instanceof gfx.Axes3)
        {
            object.material.visible = showAxes;
        }
        // Set the visibility of all materials that are not coordinate axes
        else if(object instanceof gfx.Mesh || object instanceof gfx.MeshInstance || object instanceof gfx.Line3)
        {
            object.material.visible = !showAxes;
        }

        // Call the function recursively for each child node
        object.children.forEach((child: gfx.Transform3) => {
            this.toggleAxesRecursive(child, showAxes);
        });
    }
}